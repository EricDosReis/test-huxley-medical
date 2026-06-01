import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { fetchStudy } from "../api/mockApi";
import {
  eventsAtom,
  signalsAtom,
  studyAtom,
  windowAtom,
} from "../store/globalStore";

export const useStudyLoader = () => {
  const { studyId } = useRecoilValue(studyAtom);
  const setStudy = useSetRecoilState(studyAtom);
  const setSignals = useSetRecoilState(signalsAtom);
  const setEvents = useSetRecoilState(eventsAtom);
  const setWindow = useSetRecoilState(windowAtom);

  useEffect(() => {
    let cancelled = false;

    setStudy((prev) => ({ ...prev, loading: true, error: undefined }));
    const controller = new AbortController();

    fetchStudy(studyId, controller.signal)
      .then((data) => {
        if (cancelled) return;

        setSignals(data.signals);
        setEvents(data.events);
        setWindow({
          startSec: data.metadata.study_start,
          endSec: data.metadata.study_end,
        });
        setStudy((prev) => ({
          ...prev,
          loading: false,
          error: undefined,
          lastFetchedAt: Date.now(),
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.name === "AbortError") return;

        setStudy((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || "Failed to load study",
        }));
      });

    return () => {
      console.info("Aborting fetchStudy for", studyId);
      cancelled = true;
      controller.abort();
    };
  }, [studyId, setStudy, setSignals, setEvents, setWindow]);
};
