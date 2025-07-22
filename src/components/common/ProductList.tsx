import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

type Subproduct = {
  subprod_name: string;
  subprod_description: string;
  subprod_status: number;
};

type Product = {
  prod_name: string;
  prod_description: string;
  prod_status: number;
  subproducts: Subproduct[];
};

type FlatRecord = {
  id: number;
  prod_name: string;
  prod_description: string;
  prod_status: number;
  partner_id: number;
  subprod_name: string;
  subprod_description: string;
  subprod_status: number;
};

// group flat data by product
function groupProducts(data: FlatRecord[]): Product[] {
  const map = new Map<string, Product>();

  for (const item of data) {
    if (!map.has(item.prod_name)) {
      map.set(item.prod_name, {
        prod_name: item.prod_name,
        prod_description: item.prod_description,
        prod_status: item.prod_status,
        subproducts: [],
      });
    }

    map.get(item.prod_name)!.subproducts.push({
      subprod_name: item.subprod_name,
      subprod_description: item.subprod_description,
      subprod_status: item.subprod_status,
    });
  }

  return Array.from(map.values());
}

export default function ProductList({ data }: { data: FlatRecord[] }) {
  const products = groupProducts(data);
  const { t } = useTranslation();
  const [tab, setTab] = useState<'products' | 'subproducts'>('products');

  // Count subproducts for all products
  // const subproductCount = products.reduce((acc, p) => acc + p.subproducts.length, 0);

  return (
    <div className="space-y-4">
      {tab === 'products' && products.map((product, i) => (
        <Card key={i} className="rounded-2xl border border-border bg-background dark:bg-muted p-6">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h3 className="text-lg font-semibold leading-tight text-foreground">{product.prod_name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.prod_description}</p>
          </div>
          <Badge variant="outline" className="text-xs px-4 py-1 rounded-full">
            {product.prod_status ? t('status:active') : t('status:inactive')}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-muted-foreground">{t('common:subproducts')}</p>
          <span className="text-sm text-muted-foreground font-medium">{product.subproducts.length}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 ">
          {product.subproducts.map((sub, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-1.5 border border-border rounded-lg bg-background dark:bg-muted text-sm min-w-0"
            >
              <span className="truncate">{sub.subprod_name}</span>
              {sub.subprod_status ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('status:active')}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  {t('status:inactive')}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
      ))}
    </div>
  );
}
