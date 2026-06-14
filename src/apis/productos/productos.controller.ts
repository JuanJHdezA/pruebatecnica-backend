import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { RegProductoDto } from './dto/create-producto.dto';
import { utileriasClass } from '@common/class/utilerias/utilerias.class';
import { AuthPrivateGuard } from '@common/guard/auth/private/auth-private.guard';
import { CreateProductServInterface, ProductoRpsService } from './interfaces/productos.services.interface';
import { RpsServicesInterface } from '@common/interfaces/response.service.interface';
import { ProductosInterface, RspProductosDetallesCtrl } from './interfaces/productos.controller.interface';
import { DeleteProductoDto } from './dto/delete-producto.dto';

@Controller('productos')
@UseGuards(AuthPrivateGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  public async consultarProductos(@Body() producto?: { codigoProducto: string }) {
    try {
      const codigoproducto: string = producto?.codigoProducto ?? '';
      const rps: RpsServicesInterface<ProductosInterface[]> = await this.productosService.getProductos(codigoproducto);
      if (rps?.error) {
        throw new Error(rps.message ?? 'Servicio no disponible');
      }

      const consulta = await this.detalleProductos(rps?.data);
      if (consulta?.error) {
        throw new Error(consulta.message ?? 'Servicio no disponible');
      }

      const data = consulta?.data ?? [];

      // si no hay código, devolvemos el array completo.
      return codigoproducto ? (data[0] ?? {}) : data;
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  private async detalleProductos(productos: ProductosInterface[]): Promise<RspProductosDetallesCtrl> {
    try {
      const ut: utileriasClass = new utileriasClass();

      for (let i = 0; i < productos.length; i++) {
        //Detalles del produto
        const detalles = [
          await this.productosService.getDetalleProducto(productos[i].idProducto, 'producto_tallas'),
          await this.productosService.getDetalleProducto(productos[i].idProducto, 'producto_categorias')
        ];

        const rps: any = await Promise.all(detalles);
        for (let j = 0; j < rps.length; j++) {
          if (rps[j]?.data?.categorias) {
            productos[i].categorias = rps[j]?.data.categorias;
          }

          if (rps[j]?.data?.tallas) {
            productos[i].tallas = rps[j]?.data.tallas;
          }
        }

        // Imagenes registradas
        const url = productos[i].urlImagen ?? '';
        if (url) {
          const f = await ut.getFile({ path: url, type: productos[i].tipoArchivo ?? '' });
          if (f.success) {
            productos[i].imagen = {
              type: f.file.type ?? '',
              content: f.file.content ?? ''
            };
          }
        }
      }

      return { error: false, message: 'Datos consultados correctamente', data: productos };
    } catch (e: any) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido al consultar el detalle de los producto';
      return { error: true, message: errMsg, data: [] };
    }
  }

  @Get('catalogos')
  public async catalogos() {
    const ut: utileriasClass = new utileriasClass();

    const catalogos = {
      cat_categorias: 'catCategorias',
      cat_estatus: 'catEstatus',
      cat_tallas: 'catTallas',
      cat_marcas: 'catMarcas'
    };

    const tablas = Object.keys(catalogos); //Indice de registro
    const promesas = tablas.map((tabla: string) => this.productosService.getCatalogos(tabla));
    const resultados = await Promise.all(promesas);

    const _catalogos = resultados.reduce((acc, rps: any, index) => {
      const _ct = tablas[index];
      const catalogo = catalogos[_ct];

      let data = [];
      if (rps?.error || rps?.data?.length > 0) {
        data = ut.camelKeys(rps?.data);
        acc[catalogo] = data;
      }

      acc[catalogo] = data;
      return acc;
    }, {} as any);

    return _catalogos;
  }

  @Post('nuevo-producto')
  public async create(@Body() producto: RegProductoDto) {
    try {
      const ut: utileriasClass = new utileriasClass();

      // Generar un código único (ejemplo: PROD-12345)
      const codigoProducto = `PROD-${Date.now().toString().slice(-6)}`;

      const metaF = producto?.imagen?.split(',');
      const extensions: any = [
        { type: 'TXT', extend: 'data:text/plain;base64' },
        { type: 'PDF', extend: 'data:application/pdf;base64' },
        { type: 'PNG', extend: 'data:image/png;base64' },
        { type: 'JPG', extend: 'data:image/jpeg;base64' },
        { type: 'JPEG', extend: 'data:image/jpeg;base64' },
        { type: 'XML', extend: 'data:application/xml;base64' },
        { type: 'XLSX', extend: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64' },
        { type: 'XLS', extend: 'data:application/vnd.ms-excel;base64' }
      ];

      const typeFile = extensions.find((item) => item.extend === metaF[0]);

      const f = await ut.uploadFile({
        path: `storage/articulos/${codigoProducto}`,
        content: producto.imagen,
        extension: typeFile?.type?.toLowerCase()
      });
      if (!f.upload) {
        throw new Error('El archivo adjunto no se ha cargado correctamente');
      }

      const reg: CreateProductServInterface = {
        codigoProducto: codigoProducto,
        nombreProducto: producto.nombreProducto,
        descripcionProducto: producto.descripcionProducto,
        idMarca: producto.idMarca,
        precio: producto.precio,
        stock: producto.stock,
        idEstatus: producto.idEstatus,
        urlImagen: f.file?.path ?? '',
        tipoArchivo: typeFile?.type ?? ''
      };

      const rps: RpsServicesInterface<ProductoRpsService> = await this.productosService.crearProducto(reg);
      if (rps?.error) {
        throw new Error(rps.message ?? 'Servicio no disponible');
      }

      //Insertar categorias de producto
      const rc = await this.productosService.insertarRelaciones(
        rps?.data?.idProducto,
        producto.categorias,
        'producto_categorias',
        'id_categoria'
      );
      if (rc?.error) {
        throw new Error(rps.message ?? 'Servicio no disponible');
      }

      //Insert tallas del Productos
      const rt = await this.productosService.insertarRelaciones(
        rps?.data?.idProducto,
        producto.tallas,
        'producto_tallas',
        'id_talla'
      );
      if (rt?.error) {
        throw new Error(rps.message ?? 'Servicio no disponible');
      }

      return rps?.data;
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('actualizar-producto')
  public async actualizarProducto(@Body() producto: RegProductoDto) {
    try {
      const ut: utileriasClass = new utileriasClass();

      let file = { urlArhivo: producto.urlImgAnterior, typeArchivo: producto.tipoArchivo, updateFile: false };
      //Si la actualización ha sido para la imagen se procede a cargar el archivo al servidor
      if (producto?.UpdateImg) {
        const metaF = producto?.imagen?.split(',');
        const extensions: any = [
          { type: 'TXT', extend: 'data:text/plain;base64' },
          { type: 'PDF', extend: 'data:application/pdf;base64' },
          { type: 'PNG', extend: 'data:image/png;base64' },
          { type: 'JPG', extend: 'data:image/jpeg;base64' },
          { type: 'JPEG', extend: 'data:image/jpeg;base64' },
          { type: 'XML', extend: 'data:application/xml;base64' },
          { type: 'XLSX', extend: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64' },
          { type: 'XLS', extend: 'data:application/vnd.ms-excel;base64' }
        ];

        const typeFile = extensions.find((item) => item.extend === metaF[0]);

        const f = await ut.uploadFile({
          path: `storage/articulos/${producto.codigoProducto}`,
          content: producto.imagen,
          extension: typeFile?.type?.toLowerCase()
        });
        if (!f.upload) {
          throw new Error('El archivo adjunto no se ha cargado correctamente');
        }

        file = { urlArhivo: f.file?.path, typeArchivo: typeFile?.type, updateFile: true };
      }

      const _product: any = {
        idProducto: producto?.idProducto ?? 0,
        nombreProducto: producto?.nombreProducto ?? '',
        descripcionProducto: producto?.descripcionProducto ?? '',
        precio: producto?.precio ?? '',
        stock: producto?.stock ?? '',
        idEstatus: producto?.idEstatus ?? '',
        idMarca: producto?.idMarca ?? '',
        urlImagen: file.urlArhivo,
        tipoArchivo: file.typeArchivo
      };

      //Actualización de registro
      const _update: RpsServicesInterface<any> = await this.productosService.actualizarProducto(_product);
      if (_update.error) {
        throw new Error(_update.message ?? 'Servicio no disponible');
      }

      //Eliminar categorias de producto
      const Delrc = await this.productosService.eliminarRegProductos(_product.idProducto, 'producto_categorias');
      if (Delrc?.error) {
        throw new Error(Delrc.message ?? 'Servicio no disponible');
      }

      //Insertar categorias de producto
      const rc = await this.productosService.insertarRelaciones(
        _product.idProducto,
        producto.categorias,
        'producto_categorias',
        'id_categoria'
      );
      if (rc?.error) {
        throw new Error(rc.message ?? 'Servicio no disponible');
      }

      //Eliminar tallas del Productos
      const Delrt = await this.productosService.eliminarRegProductos(_product.idProducto, 'producto_tallas');
      if (Delrt?.error) {
        throw new Error(Delrt.message ?? 'Servicio no disponible');
      }
      //Insert tallas del Productos
      const rt = await this.productosService.insertarRelaciones(
        _product.idProducto,
        producto.tallas,
        'producto_tallas',
        'id_talla'
      );
      if (rt?.error) {
        throw new Error(rt.message ?? 'Servicio no disponible');
      }

      //Si existe una imagen anterior y se cargo correctamente la imagen la nueva imagen, se elimina
      if (file.updateFile) await ut.unlinkFile(producto?.urlImgAnterior);

      return _update?.data;
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('eliminar-producto')
  public async eliminarProducto(@Body() producto: DeleteProductoDto) {
    try {
      const ut: utileriasClass = new utileriasClass();

      //Eliminar categorias de producto
      const Delrc = await this.productosService.eliminarRegProductos(producto.idProducto ?? 0, 'producto_categorias');
      if (Delrc?.error) {
        throw new Error(Delrc.message ?? 'Servicio no disponible');
      }

      //Eliminar tallas del Productos
      const Delrt = await this.productosService.eliminarRegProductos(producto.idProducto ?? 0, 'producto_tallas');
      if (Delrt?.error) {
        throw new Error(Delrt.message ?? 'Servicio no disponible');
      }

      //Eliminar tallas del Productos
      const DelProd = await this.productosService.eliminarRegProductos(producto.idProducto ?? 0, 'productos');
      if (DelProd?.error) {
        throw new Error(DelProd.message ?? 'Servicio no disponible');
      }

      await ut.unlinkFile(producto?.urlImagen);

      return 'Productor eliminado correctamente';
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}
