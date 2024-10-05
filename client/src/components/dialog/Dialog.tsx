import React from "react";
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
  return (
    <Dialog modal={true}>
      <Button variant={"secondary"}>
        <DialogTrigger>{buttonTitle}</DialogTrigger>
      </Button>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogComp;
