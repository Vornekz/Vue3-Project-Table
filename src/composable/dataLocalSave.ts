import { useProjectData } from "@/store/projectData";
import { useSelectIndex } from "@/store/selectIndex";

export const saveData = () => {
  const projectData = useProjectData();
  const index = useSelectIndex();
  const localData: string = JSON.stringify(projectData.projectOptions);
  const localArchived: string = JSON.stringify(projectData.projectArchived);
  const localCount: string = JSON.stringify(
    index.group.map((item) => item.count)
  );
  localStorage.count = localCount;
  localStorage.data = localData;
  localStorage.archived = localArchived;
};
