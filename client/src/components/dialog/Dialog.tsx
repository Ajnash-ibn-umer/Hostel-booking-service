"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const DialogComp: React.FC<{
  buttonTitle: string;
  dialogTitle: string;
  dialogDescription: string;
  children: any;
}> = ({ buttonTitle, dialogTitle, children, dialogDescription }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  return (
    <div>
      <Button onClick={handleOpenDialog} variant={"secondary"}>
        {buttonTitle}
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogComp;
