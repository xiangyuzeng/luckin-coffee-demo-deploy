import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { CheckIcon, Filter } from 'lucide-react';
import { Category } from '@prisma/client';
import { cn } from '@/lib/utils';

type CategoryFilterProps = {
  categoryList: Category[];
  selectedCategoryList: string[] | undefined;
  setFilterCategory: (categoryArray: string[] | undefined) => void;
};

const CategoryFilter = ({
  categoryList,
  selectedCategoryList,
  setFilterCategory
}: CategoryFilterProps) => {
  const selectedValues = new Set(selectedCategoryList as string[]);

  return (
    <div className="absolute left-1/2 top-14 mt-5 -translate-x-1/2 transform sm:left-[60px] sm:translate-x-0">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            <Filter className="mr-3 h-4 w-4" />
            Category filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <Command>
            <CommandInput placeholder="Select category" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {categoryList.map((category) => {
                  const isSelected = selectedValues.has(category.id);
                  return (
                    <CommandItem
                      key={category.id}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(category.id);
                        } else {
                          selectedValues.add(category.id);
                        }
                        const filterValues =
                          Array.from(selectedValues);
                        setFilterCategory(filterValues);
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className={cn('h-4 w-4')} />
                      </div>

                      <span>{category.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setFilterCategory(undefined)}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CategoryFilter;
