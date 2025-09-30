import { parseAsString, useQueryState } from "nuqs";

export const useTaskFilters = () => {
  const [projectId, setProjectId] = useQueryState(
    "projectId",
    parseAsString.withDefault("")
  );

  const [status, setStatus] = useQueryState(
    "status", 
    parseAsString.withDefault("")
  );

  const [assigneeId, setAssigneeId] = useQueryState(
    "assigneeId",
    parseAsString.withDefault("")
  );

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  return {
    projectId,
    setProjectId,
    status,
    setStatus,
    assigneeId,
    setAssigneeId,
    search,
    setSearch,
  };
};