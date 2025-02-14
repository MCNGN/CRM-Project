"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
//   DialogDescription,
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

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const handleLogActivity = (activityType: 'Email' | 'Phone' | 'Meeting') => {
    console.log(`Logging ${activityType} activity`);
    // Add your logging logic here
  };

  const handleSaveLog = (activityType: 'Email' | 'Phone' | 'Meeting') => {
    setLoggedActivities((prevActivities) => ({
      ...prevActivities,
      [activityType]: [
        ...prevActivities[activityType],
        { title: logTitle, message: logMessage },
      ],
    }));
    setLogTitle("");
    setLogMessage("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-1/5">
        <div className="ml-8 mt-4 flex items-center">
          <div className="mr-4">
            <Avatar className="h-[110px] w-[110px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="text-3xl font-black">Geraldine</div>
            <div className="text-xl font-bold">KAI Oanjang</div>
            <div className="flex text-sm font-medium">
              <div>+628896412 </div>
              <div> - aiodhad@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-4/5 flex">
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
        <div className="w-full p-4">
          {selectedMenu === "Activity" && <div>Activity Content</div>}
          {selectedMenu === "Email" && (
            <div className="flex flex-col">
              <div className="flex justify-end mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleLogActivity("Email")}>
                      Create Log Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
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
                      <Button
                        type="button"
                        onClick={() => handleSaveLog("Email")}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {loggedActivities.Email.length === 0 ? (
                <div>No email logs available.</div>
              ) : (
                loggedActivities.Email.map((log, index) => (
                  <div key={index} className="border-gray-200 border p-2 bg-gray-100 rounded-sm shadow-md mb-4">
                    <div>
                      <strong>{log.title}</strong>
                      <p>{log.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {selectedMenu === "Phone" && (
            <div>
              <Button onClick={() => handleLogActivity("Phone")}>
                Log Phone
              </Button>
              Phone Content
            </div>
          )}
          {selectedMenu === "Meeting" && (
            <div>
              <Button onClick={() => handleLogActivity("Meeting")}>
                Log Meeting
              </Button>
              Meeting Content
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
