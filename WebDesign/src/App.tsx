import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectDetails } from './components/ProjectDetails';
import { ItemManagement, Item } from './components/ItemManagement';
import { Reports } from './components/Reports';
import { Charts } from './components/Charts';
import { Footer } from './components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(false);
  
  // Project state
  const [projectName, setProjectName] = useState('New Project');
  const [vatRate, setVatRate] = useState('15');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState('project-details');

  // Theme toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Initialize theme based on system preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate totals for footer
  const totalValue = items.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="project-details">Project Details</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="project-details" className="space-y-6">
              <div className="flex justify-center">
                <ProjectDetails
                  projectName={projectName}
                  setProjectName={setProjectName}
                  vatRate={vatRate}
                  setVatRate={setVatRate}
                  currency={currency}
                  setCurrency={setCurrency}
                />
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <ItemManagement
                items={items}
                setItems={setItems}
                currency={currency}
                defaultVatRate={Number(vatRate)}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Reports
                projectName={projectName}
                items={items}
                currency={currency}
                vatRate={vatRate}
              />
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <Charts
                items={items}
                currency={currency}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer
        itemCount={items.length}
        totalValue={totalValue}
        currency={currency}
      />
    </div>
  );
}