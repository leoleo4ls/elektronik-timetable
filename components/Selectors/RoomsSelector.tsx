import { useState, useRef, RefObject, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import { ListItem } from "@wulkanowy/timetable-parser";
import { SortedListItem } from "../../types/SortedListItem";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

type RoomsSelectorProps = {
  rooms?: ListItem[];
};

const RoomsSelector = ({ rooms }: RoomsSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [sortedRooms, setSortedRooms] = useState<SortedListItem[]>([]);
  const router = useRouter();
  const getRoundedClass = (stateValue: boolean) => {
    if (stateValue) return "rounded-t-lg";
    else return "rounded-lg";
  };
  const selectorRef = useRef<HTMLDivElement>(null);
  const handleClick = (
    state: boolean,
    stateChangeFunction: Function,
    ref: RefObject<HTMLDivElement>
  ) => {
    if (!state && ref && null !== ref.current)
      ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
    else if (null !== ref.current) ref.current.style.maxHeight = "0";
    stateChangeFunction(!state);
  };
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setSortedRooms(/*[
        {
          char: "Piwnice",
          items: rooms
            .filter((room) => room.name.split(" ")[0][0] === "0")
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
        {
          char: "Sale „...w”",
          items: rooms
            .filter((room) => room.name.split(" ")[0][1] === "w")
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
        {
          char: "Sale gimnastyczne",
          items: rooms
            .filter((room) => room.name.split(" ")[0][0] === "s")
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
        {
          char: "Parter",
          items: rooms
            .filter(
              (room) =>
                Number(room.name.split(" ")[0]) >= 1 &&
                Number(room.name.split(" ")[0]) < 100
            )
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
      ]*/[
        {
          char: "",
          items: rooms
        }
      ]);
    }
  }, [rooms]);
  return (
    <div className="mb-8">
      <button
        onClick={() => handleClick(open, setOpen, selectorRef)}
        className={`bg-green-100 w-full px-4 py-3 flex justify-between items-center transition-all duration-75 ${getRoundedClass(
          open
        )}`}
      >
        <div className="flex items-center">
          <LocationMarkerIcon className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">Sale</h2>
        </div>
        {!open && <ChevronDownIcon className="h-5 w-5" />}
        {open && <ChevronUpIcon className="h-5 w-5" />}
      </button>
      <div
        className="bg-green-50 rounded-b-lg overflow-hidden transition-all"
        style={{ maxHeight: 0 }}
        ref={selectorRef}
      >
        {sortedRooms && sortedRooms.length > 0 ? (
          sortedRooms.map((sortedItem) => {
            return (
              <div key={`bottomBar-room-${sortedItem.char}`}>
                <h3 className="text-xl mb-2 px-4 first:pt-4 last:pb-4 font-medium">
                  {sortedItem.char}
                </h3>
                {sortedItem.items.map((item, index) => {
                  return (
                    <Link
                      key={`bottomBar-room-letter-${sortedItem.char}-${index}`}
                      href={`/room/${item.value}`}
                    >
                      <a
                        className={`mb-2 px-4 first:pt-4 last:pb-4 block ${router.asPath === `/room/${item.value}` ? "font-bold" : ""}`}
                      >
                        {item.name}
                      </a>
                    </Link>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p>Brak danych</p>
        )}
      </div>
    </div>
  );
};

export default RoomsSelector;