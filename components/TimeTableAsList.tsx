import {
  AcademicCapIcon,
  LocationMarkerIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { List } from "@wulkanowy/timetable-parser";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import * as React from "react";
import InlineSVG from "react-inlinesvg";
import { TimeTableData } from "../types/TimeTable";

interface Props {
  timeTable: TimeTableData;
  timeTableList: List;
}

const TimeTableAsList = ({ timeTable, timeTableList }: Props) => {
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<
    number | undefined
  >();

  const shortDayNames = ["Pon.", "Wt.", "Śr.", "Czw.", "Pt."];

  const router = useRouter();

  React.useEffect(() => {
    if (timeTable?.dayNames?.length > 0) {
      const dayNumber = new Date().getDay();
      if (dayNumber >= 1 && dayNumber <= 5) setSelectedDayIndex(dayNumber - 1);
      else setSelectedDayIndex(0);
    }
  }, [timeTable.dayNames, router.asPath]);


  const getClassData = React.useCallback(
    (classCode: string | undefined) => {
      return timeTableList.classes?.find(
        (singleClass) => singleClass.name.split(" ")[0] === classCode
      );
    },
    [timeTableList.classes]
  );

  const getTeacherData = React.useCallback(
    (teacherCode: string | undefined) => {
      return timeTableList.teachers?.find(
        (teacher) => teacher.name.split(" ")[1] === `(${teacherCode})`
      );
    },
    [timeTableList.teachers]
  );

  const getRoomData = React.useCallback(
    (roomNumber: string | undefined) => {
      return timeTableList.rooms?.find(
        (room) => room.name.split(" ")[0] === roomNumber
      );
    },
    [timeTableList.rooms]
  );

  return (
    <div className="pb-24 lg:pb-4">
      <div className="bg-gray-200 flex justify-between px-6 mb-8 sticky top-0 lg:h-[4.5rem]">
        {timeTable.dayNames.map((dayName, index) => (
          <button
            key={`dayName-${dayName}`}
            className={`py-4 w-1/5 ${
              selectedDayIndex === index ? "bg-elektronik-blue text-white" : ""
            }`}
            onClick={() => setSelectedDayIndex(index)}
          >
            <span className="hidden xs:inline">{dayName}</span>
            <span className="xs:hidden">{shortDayNames[index]}</span>
          </button>
        ))}
      </div>
      <div className="px-6">
        {Object.entries(timeTable.hours).map((key, index) => (
          <div key={`hour-${key}`} className="shadow rounded mb-5 flex">
            <div className="bg-elektronik-red text-white w-24 rounded-l py-1 flex-shrink-0 flex flex-col justify-center">
              <span className="block text-center font-bold mb-1">
                {key[1].number}
              </span>
              <span className="block text-center text-sm">
                {key[1].timeFrom} - {key[1].timeTo}
              </span>
            </div>
            <div className="bg-gray-50 w-full px-4 py-1">
              {selectedDayIndex != null &&
                timeTable.days[selectedDayIndex][index].length > 0 &&
                timeTable.days[selectedDayIndex][index].map(
                  (subject, subjectIndex) => (
                    <div
                      key={`day-${selectedDayIndex}-${index}-${subjectIndex}`}
                      className={
                        subjectIndex !==
                        timeTable.days[selectedDayIndex][index].length - 1
                          ? "mb-2"
                          : ""
                      }
                    >
                      <p className="font-bold mb-1">
                        {subject.subject}
                        {subject.groupName && ` (${subject.groupName})`}
                      </p>
                      <div className="text-sm flex">
                        {router.query.all &&
                          router.query.all[0] !== "class" &&
                          subject.className && (
                            <div className="flex items-center mr-4">
                              <AcademicCapIcon className="h-3 w-3 mr-1" />
                              <Link
                                href={`/class/${
                                  getClassData(subject.className)?.value
                                }`}
                              >
                                <a className="text-elektronik-blue">
                                  {
                                    getClassData(subject.className)?.name.split(
                                      " "
                                    )[0]
                                  }
                                </a>
                              </Link>
                            </div>
                          )}
                        {router.query.all &&
                          router.query.all[0] !== "teacher" &&
                          subject.teacher && (
                            <div className="flex items-center mr-4">
                              <UserGroupIcon className="h-3 w-3 mr-1" />
                              <Link
                                href={`/teacher/${
                                  getTeacherData(subject.teacher)?.value
                                }`}
                              >
                                <a className="text-elektronik-blue">
                                  {
                                    getTeacherData(subject.teacher)?.name.split(
                                      " "
                                    )[0]
                                  }
                                </a>
                              </Link>
                            </div>
                          )}{" "}
                        {router.query.all &&
                          router.query.all[0] !== "room" &&
                          subject.room && (
                            <div className="flex items-center">
                              <LocationMarkerIcon className="h-3 w-3 mr-1" />
                              <Link
                                href={`/room/${
                                  getRoomData(subject.room)?.value
                                }`}
                              >
                                <a className="text-elektronik-blue">
                                  {
                                    getRoomData(subject.room)?.name.split(
                                      " "
                                    )[0]
                                  }
                                </a>
                              </Link>
                            </div>
                          )}
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTableAsList;