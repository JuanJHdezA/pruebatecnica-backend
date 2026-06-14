export interface RspProductosDetallesCtrl {
  error: boolean;
  message: string;
  data: ProductosInterface[];
}

export interface ProductosInterface {
  idProducto: number;
  createdAt: string;
  codigoProducto: string;
  nombreProducto?: string;
  descripcionProducto?: string;
  precio: number;
  stock: number;
  idEstatus: number;
  idMarca: number;
  urlImagen?: string;
  tipoArchivo?: string;
  imagen?: {
    type?: string;
    content: string;
  };
  tallas?: ProductosTallas[];
  categorias?: ProductosCategorias[];
}

export interface ProductosCategorias {
  idProductoCategoria: number;
  createdAt: string;
  idProducto: number;
  idCategoria: number;
}

export interface ProductosTallas {
  idProductoTalla: number;
  createdAt: string;
  idProducto: number;
  idTalla: number;
}
