import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { NotAllowerError } from '@/core/errors/use-case-errors/not-allowed-error'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowerError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(
      notificationId,
    )

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowerError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
