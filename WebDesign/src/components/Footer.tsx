import { Check, Clock } from 'lucide-react';

interface FooterProps {
  itemCount: number;
  totalValue: number;
  currency: string;
}

export function Footer({ itemCount, totalValue, currency }: FooterProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <footer className="border-t bg-card/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-4 h-4" />
              <span>Auto-saved</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: {currentTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-muted-foreground">
            <span>{itemCount} items</span>
            <span>Total: {currency} {totalValue.toFixed(2)}</span>
            <span>Material Cost Estimator v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}