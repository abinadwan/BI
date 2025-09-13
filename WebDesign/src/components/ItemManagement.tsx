import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

export interface Item {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  costPerUnit: number;
  discount: number;
  vatRate: number;
  finalPrice: number;
}

interface ItemManagementProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  currency: string;
  defaultVatRate: number;
}

export function ItemManagement({ items, setItems, currency, defaultVatRate }: ItemManagementProps) {
  const [newItem, setNewItem] = useState({
    name: '',
    unit: 'pcs',
    quantity: 1,
    costPerUnit: 0,
    discount: 0
  });

  const calculateFinalPrice = (quantity: number, costPerUnit: number, discount: number, vatRate: number) => {
    const subtotal = quantity * costPerUnit;
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = afterDiscount * (vatRate / 100);
    return afterDiscount + vatAmount;
  };

  const addItem = () => {
    if (!newItem.name) return;

    const finalPrice = calculateFinalPrice(
      newItem.quantity, 
      newItem.costPerUnit, 
      newItem.discount, 
      defaultVatRate
    );

    const item: Item = {
      id: Date.now().toString(),
      name: newItem.name,
      unit: newItem.unit,
      quantity: newItem.quantity,
      costPerUnit: newItem.costPerUnit,
      discount: newItem.discount,
      vatRate: defaultVatRate,
      finalPrice
    };

    setItems([...items, item]);
    setNewItem({
      name: '',
      unit: 'pcs',
      quantity: 1,
      costPerUnit: 0,
      discount: 0
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (['quantity', 'costPerUnit', 'discount', 'vatRate'].includes(field)) {
          updatedItem.finalPrice = calculateFinalPrice(
            updatedItem.quantity,
            updatedItem.costPerUnit,
            updatedItem.discount,
            updatedItem.vatRate
          );
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const totalValue = items.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Item Management</CardTitle>
        <CardDescription>
          Add and manage project items with pricing calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Item Form */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium">Add New Item</h4>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="md:col-span-2"
            />
            <Input
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Cost per unit"
              value={newItem.costPerUnit}
              onChange={(e) => setNewItem({...newItem, costPerUnit: Number(e.target.value)})}
            />
            <Input
              type="number"
              placeholder="Discount %"
              value={newItem.discount}
              onChange={(e) => setNewItem({...newItem, discount: Number(e.target.value)})}
            />
          </div>
          <Button onClick={addItem} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost/Unit</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="border-0 bg-transparent p-0 h-auto"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="border-0 bg-transparent p-0 h-auto w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="border-0 bg-transparent p-0 h-auto w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.costPerUnit}
                      onChange={(e) => updateItem(item.id, 'costPerUnit', Number(e.target.value))}
                      className="border-0 bg-transparent p-0 h-auto w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                        className="border-0 bg-transparent p-0 h-auto w-16"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={item.vatRate}
                        onChange={(e) => updateItem(item.id, 'vatRate', Number(e.target.value))}
                        className="border-0 bg-transparent p-0 h-auto w-16"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {currency} {item.finalPrice.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No items added yet. Use the form above to add your first item.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total */}
        {items.length > 0 && (
          <div className="flex justify-end">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Project Value</div>
              <div className="text-2xl font-semibold text-primary">
                {currency} {totalValue.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}