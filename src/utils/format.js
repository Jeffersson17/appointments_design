export const formatCurrency = (value) =>
  Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDateBR = (isoDate) => {
  if (!isoDate) return "";
  const datePart = String(isoDate).slice(0, 10);
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

export const formatTimeBR = (isoDateTime) => {
  if (!isoDateTime) return "";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTimeBR = (isoDateTime) => {
  if (!isoDateTime) return "";
  const date = formatDateBR(isoDateTime);
  const time = formatTimeBR(isoDateTime);
  if (!date || !time) return isoDateTime;
  return `${date} às ${time}`;
};

export const formatDuration = (duration) => {
  const [hours, minutes] = duration.split(":").map(Number);
  if (hours === 0) {
    return `${minutes} min`;
  }
  return minutes ? `${hours}h ${minutes}min` : `${hours}h`;
};

export const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};
