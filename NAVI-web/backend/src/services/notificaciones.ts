import { getMessaging } from "firebase-admin/messaging";

// Falla en silencio a propósito: un push que no llega (token vencido,
// usuario sin notificaciones, etc.) nunca debe tumbar la acción real
// (cambiar un pedido, cobrar, etc.).
export const enviarNotificacion = async (fcmToken: string, title: string, body: string) => {
  try {
    await getMessaging().send({ token: fcmToken, notification: { title, body } });
  } catch (error) {
    console.log("No se pudo enviar la notificación push:", error);
  }
};

export const mensajePorEstadoPedido = (status: string) => {
  switch (status) {
    case "En preparación":
      return "Ya estamos preparando tu pedido.";
    case "Listo":
      return "¡Tu pedido ya está listo para recoger!";
    case "Recogido":
      return "Gracias por tu compra.";
    case "Cancelado":
      return "Tu pedido fue cancelado.";
    default:
      return "Tu pedido cambió de estado.";
  }
};
