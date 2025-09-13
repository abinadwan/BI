import { FileText, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Item } from './ItemManagement';

interface ReportsProps {
  projectName: string;
  items: Item[];
  currency: string;
  vatRate: string;
}

export function Reports({ projectName, items, currency, vatRate }: ReportsProps) {
  const totalValue = items.reduce((sum, item) => sum + item.finalPrice, 0);
  const totalVAT = items.reduce((sum, item) => {
    const subtotal = item.quantity * item.costPerUnit;
    const discountAmount = subtotal * (item.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    return sum + (afterDiscount * (item.vatRate / 100));
  }, 0);
  const subtotalWithoutVAT = totalValue - totalVAT;

  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    // Mock export functionality
    const action = type === 'print' ? 'printing' : `exporting to ${type.toUpperCase()}`;
    alert(`Mock ${action} functionality - In a real app, this would ${action === 'printing' ? 'print' : 'download'} the report.`);
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Export your cost estimation report in different formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Export to PDF</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExport('print')}
              className="flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Estimation Report</CardTitle>
          <CardDescription>
            Preview of your project cost estimation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Project Name</h4>
              <p>{projectName || 'Untitled Project'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Currency</h4>
              <p>{currency}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Default VAT Rate</h4>
              <p>{vatRate}%</p>
            </div>
          </div>

          <Separator />

          {/* Items Summary */}
          <div>
            <h4 className="font-medium mb-3">Items Summary</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.quantity} {item.unit}
                      </Badge>
                      {item.discount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          -{item.discount}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currency} {item.costPerUnit.toFixed(2)} per {item.unit} • VAT: {item.vatRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {currency} {item.finalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No items to display. Add items to see the report.
                </p>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <>
              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal (excluding VAT):</span>
                  <span>{currency} {subtotalWithoutVAT.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total VAT:</span>
                  <span>{currency} {totalVAT.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-primary">{currency} {totalValue.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}