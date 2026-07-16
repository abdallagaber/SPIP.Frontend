export interface UpdateProductRequest {
    erpId: string;
    name: string;
    sku: string;
    barcode: string;
    description: string;
    unitPrice: number;
    uom: string;
    vendorId: number;
}
