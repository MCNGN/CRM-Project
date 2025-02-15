"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export default function Sales() {
  const router = useRouter();

  const [sales, setSales] = useState([
    {
      date: "15/02/2025",
      invoice: "INV-1",
      recipient: "+62851927591231",
      amount: "1000",
    },
    // Add more sales here
  ]);

  const [formData, setFormData] = useState({
    date: "",
    invoice: "",
    recipient: "",
    amount: "",
  });

  const [editingSaleIndex, setEditingSaleIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSales((prevSales) => [...prevSales, formData]);
    setFormData({
      date: "",
      invoice: "",
      recipient: "",
      amount: "",
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingSaleIndex !== null) {
      setSales((prevSales) =>
        prevSales.map((sale, index) =>
          index === editingSaleIndex ? formData : sale
        )
      );
      setEditingSaleIndex(null);
      setFormData({
        date: "",
        invoice: "",
        recipient: "",
        amount: "",
      });
    }
  };

  const handleEditClick = (index: number) => {
    setEditingSaleIndex(index);
    setFormData(sales[index]);
  };

  return (
    <div className="flex flex-col w-full p-8">
      <div className="flex justify-end mb-4">
        <Sheet>
          <SheetTrigger>
            <Button>+ Create a sale</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create a Sale</SheetTitle>
              <SheetDescription>
                Add sales details. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    placeholder="Enter a date"
                    className="col-span-3"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="invoice" className="text-right">
                    Invoice
                  </Label>
                  <Input
                    id="invoice"
                    placeholder="Enter an invoice number"
                    className="col-span-3"
                    value={formData.invoice}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipient" className="text-right">
                    Recipient
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="Enter a recipient"
                    className="col-span-3"
                    value={formData.recipient}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    placeholder="Enter an amount"
                    className="col-span-3"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Create sale</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead hidden={true}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.invoice}</TableCell>
                <TableCell>{sale.recipient}</TableCell>
                <TableCell>{sale.amount}</TableCell>
                <TableCell>
                  <Sheet>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          {/* <MoreHorizontal /> */}
                          ...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(index)}
                        >
                          <SheetTrigger>Edit Sale</SheetTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/sales/${index+1}`)} className="hover:cursor-pointer">View sale</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Sale</SheetTitle>
                        <SheetDescription>
                          Make changes to the sale. Click save when
                          you&apos;re done.
                        </SheetDescription>
                      </SheetHeader>
                      <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              Date
                            </Label>
                            <Input
                              id="date"
                              placeholder="Enter a date"
                              className="col-span-3"
                              value={formData.date}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="invoice" className="text-right">
                              Invoice
                            </Label>
                            <Input
                              id="invoice"
                              placeholder="Enter an invoice number"
                              className="col-span-3"
                              value={formData.invoice}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="recipient" className="text-right">
                              Recipient
                            </Label>
                            <Input
                              id="recipient"
                              placeholder="Enter a recipient"
                              className="col-span-3"
                              value={formData.recipient}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              placeholder="Enter an amount"
                              className="col-span-3"
                              value={formData.amount}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                          </SheetClose>
                        </SheetFooter>
                      </form>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}