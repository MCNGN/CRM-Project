"use client";

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
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Contact() {
  const router = useRouter();

  interface Contact {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
  }

  const [contacts, setContacts] = useState<Contact[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(
    null
  );

  const userRole = Cookies.get("role");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://crm-backend.rafifaz.com/api/contact"
        );
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

    fetchContacts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://crm-backend.rafifaz.com/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const newContact = await response.json();
        setContacts((prevContacts) => [...prevContacts, newContact]);
        setFormData({
          name: "",
          company: "",
          phone: "",
          email: "",
        });
      } else {
        console.error("Failed to create contact");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingContactIndex !== null) {
      try {
        const response = await fetch(
          `https://crm-backend.rafifaz.com/api/contact/${contacts[editingContactIndex].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const updatedContact = await response.json();
          setContacts((prevContacts) =>
            prevContacts.map((contact, index) =>
              index === editingContactIndex ? updatedContact : contact
            )
          );
          setEditingContactIndex(null);
          setFormData({
            name: "",
            company: "",
            phone: "",
            email: "",
          });
        } else {
          console.error("Failed to update contact");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleEditClick = (index: number) => {
    setEditingContactIndex(index);
    setFormData(contacts[index]);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `https://crm-backend.rafifaz.com/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id)
        );
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        {contacts.length === 0 ? (
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
              <TableBody></TableBody>
            </Table>
            <div className="flex w-full h-[760px] justify-center items-center">
              <div className="text-base">No contact list</div>
            </div>
          </div>
        ) : (
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
                  <TableCell
                    className="hover:text-gray-500 hover:cursor-pointer hover:underline"
                    onClick={() => router.push(`/contact/${contact.id}`)}
                  >
                    {contact.name}
                  </TableCell>
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
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/contact/${contact.id}`)
                            }
                            className="hover:cursor-pointer"
                          >
                            View customer
                          </DropdownMenuItem>
                          {userRole === "manager" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(contact.id)}
                              >
                                Delete Contact
                              </DropdownMenuItem>
                            </>
                          )}
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
        )}
      </div>
    </div>
  );
}
