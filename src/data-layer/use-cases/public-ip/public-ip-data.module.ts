import { Module } from '@nestjs/common';
import { CloudstackModule } from 'src/infra/cloudstack/cloudstack.module';
import { PublicIpRepositoryModule } from 'src/infra/db/postgres/public-ip/public-ip-repository.module';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { AcquirePublicIpProvider } from './acquire-public-ip';
import { JobRepositoryModule } from 'src/infra/db/postgres/job/job-repository.module';

@Module({
  imports: [
    PrismaModule,
    CloudstackModule,
    PublicIpRepositoryModule,
    JobRepositoryModule,
  ],
  providers: [AcquirePublicIpProvider],
  exports: [AcquirePublicIpProvider],
})
export class PublicIpDataModule {}
