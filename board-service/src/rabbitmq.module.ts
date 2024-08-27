import { Module, Global } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Global()
@Module({
  providers: [
    {
      provide: 'GUARD_CLIENT',
      useFactory: (): ClientProxy => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`,
            ],
            queue: 'guard_queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
  exports: ['GUARD_CLIENT'],
})
export class RabbitMQModule {}
