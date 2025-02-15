"use client";

// import Image from "next/image";
import {
  Table,
  TableBody,
  //   TableCaption,
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
import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Contact() {
  const router = useRouter();

  const [contacts, setContacts] = useState([
    {
      name: "Jone Doe",
      company: "PT. KAI",
      phone: "+62851927591231",
      email: "jone@doe.com",
    },
    // Add more contacts here
  ]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContacts((prevContacts) => [...prevContacts, formData]);
    setFormData({
      name: "",
      company: "",
      phone: "",
      email: "",
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingContactIndex !== null) {
      setContacts((prevContacts) =>
        prevContacts.map((contact, index) =>
          index === editingContactIndex ? formData : contact
        )
      );
      setEditingContactIndex(null);
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
      });
    }
  };

  const handleEditClick = (index: number) => {
    setEditingContactIndex(index);
    setFormData(contacts[index]);
  };

  

  return (
    <div className="flex flex-col w-full p-8">
      <div className="flex justify-end mb-4">
        <Sheet>
          <SheetTrigger>
            <Button>+ Create a contact</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create a Contact</SheetTitle>
              <SheetDescription>
                Make contacts to list. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter a name"
                    className="col-span-3"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="Enter a company name"
                    className="col-span-3"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Enter a phone number"
                    className="col-span-3"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    E-Mail
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter an email address"
                    className="col-span-3"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Create contact</Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead hidden={true}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact, index) => (
              <TableRow key={index}>
                <TableCell className="hover:text-gray-500 hover:cursor-pointer hover:underline" onClick={() => router.push(`/contact/${index+1}`)}>{contact.name}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.email}</TableCell>
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
                          <SheetTrigger>Edit Contact</SheetTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/contact/${index+1}`)} className="hover:cursor-pointer">View customer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Contact</SheetTitle>
                        <SheetDescription>
                          Make changes to the contact. Click save when
                          you&apos;re done.
                        </SheetDescription>
                      </SheetHeader>
                      <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              placeholder="Enter a name"
                              className="col-span-3"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right">
                              Company
                            </Label>
                            <Input
                              id="company"
                              placeholder="Enter a company name"
                              className="col-span-3"
                              value={formData.company}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              id="phone"
                              placeholder="Enter a phone number"
                              className="col-span-3"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              E-Mail
                            </Label>
                            <Input
                              id="email"
                              placeholder="Enter an email address"
                              className="col-span-3"
                              value={formData.email}
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
