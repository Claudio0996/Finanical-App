exports.getInstallmentDate = (baseDate, index) => {
  const oldDate = new Date(baseDate);

  const newMonth = oldDate.getMonth() + index;

  oldDate.setMonth(newMonth);

  return oldDate;
};
