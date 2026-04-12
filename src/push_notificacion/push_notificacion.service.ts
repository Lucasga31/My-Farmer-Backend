import { Injectable, Logger } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class PushNotificacionService {
  private readonly expo = new Expo();
  private readonly logger = new Logger(PushNotificacionService.name);

  /**
   * Envía una notificación push a un dispositivo mediante su token de Expo.
   * @param token Token de Expo del dispositivo destino.
   * @param titulo Título de la notificación.
   * @param cuerpo Texto del cuerpo de la notificación.
   */
  async enviarNotificacion(token: string, titulo: string, cuerpo: string): Promise<void> {
    if (!Expo.isExpoPushToken(token)) {
      this.logger.warn(`Token inválido ignorado: ${token}`);
      return;
    }

    const mensaje: ExpoPushMessage = {
      to: token,
      sound: 'default',
      title: titulo,
      body: cuerpo,
    };

    const chunks = this.expo.chunkPushNotifications([mensaje]);
    for (const chunk of chunks) {
      const tickets: ExpoPushTicket[] = await this.expo.sendPushNotificationsAsync(chunk);
      this.logger.log(`Tickets de push: ${JSON.stringify(tickets)}`);
    }
  }
}
