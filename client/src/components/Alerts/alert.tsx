import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
export function AlertConfirm({
  title,
  description,
  cancel,
  confirm,
  onContinue,
  onCancel,
  children
}: {
  title: string;
  description: string;
  cancel: string;
  confirm: string;
  onContinue: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog
    
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
      >
   
    <AlertDialogHeader
     className="z-2000"
    >
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>{confirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
