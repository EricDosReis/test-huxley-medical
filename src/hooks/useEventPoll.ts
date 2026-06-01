import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { fetchEvents } from "../api/mockApi";
import { eventsAtom, studyAtom } from "../store/globalStore";

export const useEventPoll = () => {
  const { studyId, pollMs } = useRecoilValue(studyAtom);
  const setStudy = useSetRecoilState(studyAtom);
  const setEvents = useSetRecoilState(eventsAtom);

  useEffect(() => {
    const id = setInterval(() => {
      fetchEvents(studyId)
        .then((newEvents) => {
          setEvents(newEvents);
          setStudy((prev) => ({ ...prev, lastFetchedAt: Date.now() }));
        })
        .catch((err) => console.error("fetchEvents failed:", err));
    }, pollMs);
    return () => {
      console.info("Clearing event polling");
      clearInterval(id);
    };
  }, [pollMs, studyId, setStudy, setEvents]);
};
