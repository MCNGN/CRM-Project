"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function Sales() {
  interface Sale {
    id: number;
    date: string;
    invoice: string;
    recipient: string;
    amount: string;
    name: string;
  }

  interface Contact {
    id: number;
    name: string;
  }

  const [sales, setSales] = useState<Sale[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [formData, setFormData] = useState({
    date: "",
    recipient: "",
    name: "",
    amount: "",
  });

  const [editingSaleIndex, setEditingSaleIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/sales");
        if (response.ok) {
          const data = await response.json();
          setSales(data);
        } else {
          console.error("Failed to fetch sales");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/contact");
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          console.error("Failed to fetch contacts");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSales();
    fetchContacts();
  }, []);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData((prevData) => ({
        ...prevData,
        date: format(selectedDate, "yyyy-MM-dd"),
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      recipient: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newSale = await response.json();
        setSales((prevSales) => [...prevSales, newSale]);
        setFormData({
          date: "",
          recipient: "",
          name: "",
          amount: "",
        });
      } else {
        console.error("Failed to create sale");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingSaleIndex !== null) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/sales/${sales[editingSaleIndex].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const updatedSale = await response.json();
          setSales((prevSales) =>
            prevSales.map((sale, index) =>
              index === editingSaleIndex ? updatedSale : sale
            )
          );
          setEditingSaleIndex(null);
          setFormData({
            date: "",
            recipient: "",
            name: "",
            amount: "",
          });
        } else {
          console.error("Failed to update sale");
        }
      } catch (error) {
        console.error("Error:", error);
      }
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
                  <Popover>
                    <PopoverTrigger>
                      <Input
                        id="date"
                        placeholder="Press to pick a date"
                        className="col-span-3 w-[247.50px] hover:cursor-pointer"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipient" className="text-right">
                    Recipient
                  </Label>
                  <Select
                    onValueChange={handleSelectChange}
                    disabled={contacts.length === 0}
                  >
                    <SelectTrigger className="w-[247.25px]">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.name}>
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                  <Button disabled={contacts.length === 0} type="submit">
                    Create sale
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        {sales.length === 0 ? (
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
              <TableBody></TableBody>
            </Table>
            <div className="flex w-full h-[760px] justify-center items-center">
              <div className="text-base">No sales list</div>
            </div>
          </div>
        ) : (
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
                  <TableCell>{sale.name}</TableCell>
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
                              <Popover>
                                <PopoverTrigger>
                                  <Input
                                    id="date"
                                    placeholder="Press to pick a date"
                                    className="col-span-3 w-[247.50px] hover:cursor-pointer"
                                    value={formData.date}
                                    onChange={handleChange}
                                  />
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateChange}
                                    className="rounded-md border"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="recipient" className="text-right">
                                Recipient
                              </Label>
                              <Input
                                id="recipient"
                                placeholder="Enter a recipient"
                                className="col-span-3"
                                value={formData.name}
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
        )}
      </div>
    </div>
  );
}
