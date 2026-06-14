import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@common/services/supabase/supabase.service';
import { RpsServicesInterface } from '@common/interfaces/response.service.interface';
import { CreateProductServInterface } from './interfaces/productos.services.interface';
import { utileriasClass } from '@common/class/utilerias/utilerias.class';

@Injectable()
export class ProductosService {
  private ut: utileriasClass = new utileriasClass();

  constructor(private supabaseService: SupabaseService) {}

  public async getProductos<T>(codeProducto?: string): Promise<RpsServicesInterface<T>> {
    try {
      let query: any = this.supabaseService.supabase.from('productos').select(`
        *,
        cat_estatus (codigo_estatus, nombre_estatus, icon_estatus, severity),
        cat_marcas (nombre_marca)
      `);

      if (codeProducto) {
        query = query.eq('codigo_producto', codeProducto).maybeSingle();
      }

      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return {
          error: false,
          message: 'Petición ejecutada correctamente',
          data: [] as T
        };
      }

      let array: any[] = [];
      if (codeProducto) {
        array.push(data);
      } else {
        array = data;
      }

      const productos = this.ut.transformArrayToCamelCase(array);
      return {
        error: false,
        message: 'Petición ejecutada correctamente',
        data: productos as T
      };
    } catch (e: any) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido al consultar los productos';
      return {
        error: true,
        message: errMsg,
        data: {} as T
      };
    }
  }

  public async getDetalleProducto<T>(
    idProducto: number,
    tabla: 'producto_categorias' | 'producto_tallas'
  ): Promise<RpsServicesInterface<T>> {
    try {
      const { data, error } = await this.supabaseService.supabase.from(tabla).select('*').eq('id_producto', idProducto);

      if (error) {
        throw new Error(error.message);
      }

      const details = this.ut.transformArrayToCamelCase(data);
      const productos = tabla == 'producto_categorias' ? { categorias: details } : { tallas: details };
      return {
        error: false,
        message: 'Petición ejecutada correctamente',
        data: productos as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido';
      return { error: true, message: errMsg, data: {} as T };
    }
  }

  public async getCatalogos<T>(catalogo: string): Promise<RpsServicesInterface<T>> {
    try {
      const { data, error } = await this.supabaseService.supabase.from(catalogo).select('*');

      if (error) {
        throw new Error(error.message);
      }

      return {
        error: false,
        message: 'Petición ejecutada correctamente',
        data: data as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido';
      return { error: true, message: errMsg, data: {} as T };
    }
  }

  public async crearProducto<T>(reg: CreateProductServInterface): Promise<RpsServicesInterface<T>> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('productos')
        .insert([
          {
            codigo_producto: reg.codigoProducto ?? null,
            nombre_producto: reg.nombreProducto ?? null,
            descripcion_producto: reg.descripcionProducto ?? null,
            precio: reg.precio,
            stock: reg.stock,
            id_estatus: reg.idEstatus,
            id_marca: reg.idMarca,
            url_imagen: reg.urlImagen,
            tipo_archivo: reg.tipoArchivo
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Error al intentar registrar el producto');
      }

      const producto = this.ut.camelKeys(data);

      return {
        error: false,
        message: 'Producto creado correctamente',
        data: producto as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido al crear el producto';
      return {
        error: true,
        message: errMsg,
        data: {} as T
      };
    }
  }

  public async insertarRelaciones<T>(
    idProducto: number,
    ids: number[],
    tabla: 'producto_categorias' | 'producto_tallas',
    campoRelacion: 'id_categoria' | 'id_talla'
  ): Promise<RpsServicesInterface<T>> {
    try {
      const datosAInsertar = ids.map((id) => ({
        id_producto: idProducto,
        [campoRelacion]: id
      }));

      const { data, error } = await this.supabaseService.supabase.from(tabla).insert(datosAInsertar);

      if (error) {
        throw new Error(`Error al insertar en ${tabla}: ${error.message}`);
      }

      return {
        error: false,
        message: `Relacion ${tabla} guardadas correctamente`,
        data: data as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : `Error desconocido al insertar en ${tabla}`;
      return {
        error: true,
        message: errMsg,
        data: {} as T
      };
    }
  }

  public async actualizarProducto<T>(reg: CreateProductServInterface): Promise<RpsServicesInterface<T>> {
    try {
      // Validamos que el ID exista para poder actualizar
      if (!reg.idProducto) {
        throw new Error('El ID del producto es necesario para realizar la actualización.');
      }

      const { data, error } = await this.supabaseService.supabase
        .from('productos')
        .update({
          nombre_producto: reg.nombreProducto,
          descripcion_producto: reg.descripcionProducto,
          precio: reg.precio,
          stock: reg.stock,
          id_estatus: reg.idEstatus,
          id_marca: reg.idMarca,
          url_imagen: reg.urlImagen,
          tipo_archivo: reg.tipoArchivo
        })
        .eq('id_producto', reg.idProducto) // IMPORTANTE: Filtra por el ID del producto
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No se pudo actualizar el producto o no existe.');
      }

      const producto = this.ut.camelKeys(data);

      return {
        error: false,
        message: 'Producto actualizado correctamente',
        data: producto as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido al actualizar el producto';
      return {
        error: true,
        message: errMsg,
        data: {} as T
      };
    }
  }

  public async eliminarRegProductos<T>(
    idProducto: number,
    table: 'producto_categorias' | 'productos' | 'producto_tallas'
  ): Promise<RpsServicesInterface<T>> {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from(table)
        .delete()
        .eq('id_producto', idProducto)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return {
          error: true,
          message: 'No se encontró el registro para eliminar',
          data: {} as T
        };
      }

      return {
        error: false,
        message: 'Registro eliminado correctamente',
        data: data as T
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Error desconocido al eliminar el Registro';
      return {
        error: true,
        message: errMsg,
        data: {} as T
      };
    }
  }
}
