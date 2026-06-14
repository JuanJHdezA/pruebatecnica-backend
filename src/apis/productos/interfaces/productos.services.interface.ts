export interface CreateProductServInterface {
  idProducto?: number;
  codigoProducto?: string;
  nombreProducto: string;
  descripcionProducto?: string; // El signo '?' indica que es opcional
  idMarca: number;
  precio: number;
  stock: number;
  idEstatus: number;
  urlImagen: string;
  tipoArchivo: string;
}

export interface ProductoRpsService {
  idProducto: number;
  createdAt: string; // O Date, dependiendo de cómo manejes las fechas
  codigoProducto: string;
  nombreProducto: string;
  descripcionProducto: string;
  precio: number;
  stock: number;
  idEstatus: number;
  idMarca: number;
  urlImagen: string;
}
