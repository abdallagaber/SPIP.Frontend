import { TableColumn } from '../../../shared/table/models/table-column.model';

export const VENDOR_TABLE_COLUMNS: TableColumn[] = [
  { field: 'erpId', header: 'ERP ID', sortable: true },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'taxRegistrationNumber', header: 'Tax Registration Number', sortable: false },
  { field: 'contactEmail', header: 'Email', sortable: true },
  { field: 'contactPhone', header: 'Phone', sortable: false },
  { field: 'address', header: 'Address', sortable: false },
  { field: 'isApproved', header: 'Approved', sortable: true },
];
