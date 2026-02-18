'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Category } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type DeleteCategoryModalProps = {
  category: Category;
  handleCategoryRefetch: () => void;
};

const DeleteCategoryModal = ({
  category,
  handleCategoryRefetch
}: DeleteCategoryModalProps) => {
  const deleteFetch = () =>
    fetch(`/api/category/${category.id}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      if (response.ok) {
        handleCategoryRefetch();
      } else {
        return response.json;
      }
    });

  const handleDeleteClick = async () => {
    toast.promise(deleteFetch, {
      loading: 'Delete ...',
      success: `Category: ${category.name} has been deleted successfully`,
      error: (err) => `Error: ${err.toString()}`
    });
  };

  return (
    <>
      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="icon">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent className="max-w-[325px] md:max-w-[425px]">
          <AlertDialogHeader>
            <div className="w-64">
              <AlertDialogTitle className="line-clamp-1 text-left">
                {`Delete: ${category.name}`}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete this category? You
              can&apos;t undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClick}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteCategoryModal;
