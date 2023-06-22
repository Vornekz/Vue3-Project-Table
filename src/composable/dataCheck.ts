import { Options } from "@/store/projectData";
import { ComputedRef, Ref } from "vue";

export function useCheck(
  updateOption: Options,
  nameVarification: ComputedRef<boolean>,
  redStyle: Ref<boolean>,
  redDataStyle: Ref<boolean>
) {
  if (updateOption.name.trim() === "" || nameVarification.value) {
    redStyle.value = true;
    updateOption.name = "";
    return true;
  } else if (
    (updateOption.status !== "Not started" && updateOption.timeline === null) ||
    (Array.isArray(updateOption.timeline) && updateOption.timeline[1] === null)
  ) {
    redDataStyle.value = true;
    return true;
  } else {
    return false;
  }
}
