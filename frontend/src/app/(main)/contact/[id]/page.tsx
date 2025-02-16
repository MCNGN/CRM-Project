"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactDetails() {
  const { id } = useParams();

  const [contact, setContact] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  const [selectedMenu, setSelectedMenu] = useState("Activity");
  const [logTitle, setLogTitle] = useState("");
  const [logMessage, setLogMessage] = useState("");

  interface Log {
    title: string;
    message: string;
  }

  const [loggedActivities, setLoggedActivities] = useState<{
    Email: Log[];
    Phone: Log[];
    Meeting: Log[];
  }>({
    Email: [],
    Phone: [],
    Meeting: [],
  });

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/contact/${id}`);
          if (response.ok) {
            const data = await response.json();
            setContact(data);
          } else {
            console.error('Failed to fetch contact');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const fetchLogs = async (type: "Email" | "Phone" | "Meeting") => {
        try {
          const response = await fetch(`http://localhost:8000/api/activity/${id}/${type}`);
          if (response.ok) {
            const data = await response.json();
            setLoggedActivities((prevActivities) => ({
              ...prevActivities,
              [type]: data,
            }));
          } else {
            console.error(`Failed to fetch ${type} logs`);
          }
        } catch (error) {
          console.error(`Error fetching ${type} logs:`, error);
        }
      };

      fetchContact();
      fetchLogs("Email");
      fetchLogs("Phone");
      fetchLogs("Meeting");
    }
  }, [id]);

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const handleLogActivity = (activityType: "Email" | "Phone" | "Meeting") => {
    console.log(`Logging ${activityType} activity`);
    // Add your logging logic here
  };

  const handleSaveLog = async (activityType: "Email" | "Phone" | "Meeting") => {
    const logData = { title: logTitle, message: logMessage, type: activityType, contact_id: id };
    try {
      const response = await fetch(`http://localhost:8000/api/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        const newLog = await response.json();
        setLoggedActivities((prevActivities) => ({
          ...prevActivities,
          [activityType]: [...prevActivities[activityType], newLog],
        }));
        setLogTitle("");
        setLogMessage("");
      } else {
        console.error('Failed to save log');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-1/6 ">
        <div className="ml-8 mt-4 flex items-center">
          <div className="mr-4">
            <Avatar className="h-[110px] w-[110px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="text-3xl font-black">{contact.name}</div>
            <div className="text-xl font-bold">{contact.company}</div>
            <div className="flex text-sm font-medium">
              <div>{contact.phone}</div>
              <div className="mx-1">•</div>
              <div>{contact.email}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-5/6 flex mt-4">
        <div className="w-[100px] flex flex-col font-medium ml-8 gap-4 mt-4">
          <div
            onClick={() => handleMenuClick("Activity")}
            className={
              selectedMenu === "Activity"
                ? "font-semibold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Activity
          </div>
          <div
            onClick={() => handleMenuClick("Email")}
            className={
              selectedMenu === "Email"
                ? "font-semibold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Email
          </div>
          <div
            onClick={() => handleMenuClick("Phone")}
            className={
              selectedMenu === "Phone"
                ? "font-semibold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Phone
          </div>
          <div
            onClick={() => handleMenuClick("Meeting")}
            className={
              selectedMenu === "Meeting"
                ? "font-semibold hover:cursor-pointer"
                : "hover:cursor-pointer"
            }
          >
            Meeting
          </div>
        </div>
        <div className="w-full p-4 h-full ">
          {selectedMenu === "Activity" && (
            <div className="flex flex-col h-full overflow-scroll no-scrollbar">
              {loggedActivities.Email.length === 0 &&
              loggedActivities.Phone.length === 0 &&
              loggedActivities.Meeting.length === 0 ? (
                <div className="flex justify-center items-center text-lg h-full">
                  No activities available.
                </div>
              ) : (
                <>
                  {loggedActivities.Email.map((log, index) => (
                    <div
                      key={index}
                      className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4 mr-4"
                    >
                      <div>
                        <strong>Logged Email - {log.title}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))}
                  {loggedActivities.Phone.map((log, index) => (
                    <div
                      key={index}
                      className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4 mr-4"
                    >
                      <div>
                        <strong>Logged Phone - {log.title}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))}
                  {loggedActivities.Meeting.map((log, index) => (
                    <div
                      key={index}
                      className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4 mr-4"
                    >
                      <div>
                        <strong>Logged Meeting - {log.title}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          {selectedMenu === "Email" && (
            <div className="flex flex-col h-full overflow-scroll no-scrollbar">
              <div className="flex justify-end mb-4 mr-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleLogActivity("Email")}>
                      Create Log Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="sticky">
                      <DialogTitle>Create email log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={logTitle}
                          onChange={(e) => setLogTitle(e.target.value)}
                          className="col-span-3"
                          placeholder=""
                        />
                      </div>
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Content</Label>
                        <Textarea
                          placeholder="Type your message here."
                          id="message"
                          value={logMessage}
                          onChange={(e) => setLogMessage(e.target.value)}
                          className="resize-none h-52"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          type="button"
                          onClick={() => handleSaveLog("Email")}
                        >
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col h-full overflow-scroll no-scrollbar ">
                {loggedActivities.Email.length === 0 ? (
                  <div className="flex justify-center items-center text-lg h-full">
                    No email logs available.
                  </div>
                ) : (
                  loggedActivities.Email.map((log, index) => (
                    <div
                      key={index}
                      className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4 mr-4"
                    >
                      <div>
                        <strong>Logged Email - {log.title}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {selectedMenu === "Phone" && (
            <div className="flex flex-col h-full no-scrollbar">
              <div className="flex justify-end mb-4 mr-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleLogActivity("Phone")}>
                      Create Log Phone
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="sticky">
                      <DialogTitle>Create phone log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={logTitle}
                          onChange={(e) => setLogTitle(e.target.value)}
                          className="col-span-3"
                          placeholder=""
                        />
                      </div>
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Content</Label>
                        <Textarea
                          placeholder="Type your message here."
                          id="message"
                          value={logMessage}
                          onChange={(e) => setLogMessage(e.target.value)}
                          className="resize-none h-52"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          type="button"
                          onClick={() => handleSaveLog("Phone")}
                        >
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col h-full overflow-scroll no-scrollbar">
                {loggedActivities.Phone.length === 0 ? (
                  <div className="flex justify-center items-center text-lg h-full">
                    No phone logs available.
                  </div>
                ) : (
                  loggedActivities.Phone.map((log, index) => (
                    <div
                      key={index}
                      className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4 mr-4"
                    >
                      <div>
                        <strong>Logged Phone - {log.title}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {selectedMenu === "Meeting" && (
            <div className="flex flex-col h-full no-scrollbar">
              <div className="flex justify-end mb-4 mr-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleLogActivity("Meeting")}>
                      Create Log Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="sticky">
                      <DialogTitle>Create meeting log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={logTitle}
                          onChange={(e) => setLogTitle(e.target.value)}
                          className="col-span-3"
                          placeholder=""
                        />
                      </div>
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Content</Label>
                        <Textarea
                          placeholder="Type your message here."
                          id="message"
                          value={logMessage}
                          onChange={(e) => setLogMessage(e.target.value)}
                          className="resize-none h-52"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          type="button"
                          onClick={() => handleSaveLog("Meeting")}
                        >
                          Save changes
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col h-full overflow-scroll no-scrollbar">
                {loggedActivities.Meeting.length === 0 ? (
                  <div className="flex justify-center items-center text-lg h-full">
                    No meeting logs available.
                  </div>
                ) : (
                  loggedActivities.Meeting.map((log, index) => (
                    <div
                      key={index}
                      className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4 mr-4"
                    >
                      <div>
                        <strong>Logged Meeting - {log.title}</strong>
                        <p>{log.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}