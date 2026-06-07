type ActionResult<T> = {
  data?: T;
};

export const getActionData = <T>(result: ActionResult<T> | undefined): T | undefined =>
  result?.data;
