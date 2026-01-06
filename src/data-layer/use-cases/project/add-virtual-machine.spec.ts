import { jest } from '@jest/globals';
import { AddVirtualMachine } from './add-virtual-machine';
import { CloudstackCommands } from 'src/infra/cloudstack/cloudstack';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';

const makeMocks = () => {
  const projectRepository = {
    getProject: jest.fn(async () => ({
      id: 'project-1',
      domain: { id: 'domain-1', name: 'account-name' },
    })),
  };
  const cloudstackService = {
    handle: jest.fn(async () => ({
      deployvirtualmachineresponse: {
        id: 'vm-cloudstack-id',
        jobid: 'job-1',
      },
    })),
  };
  const configService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'CLOUDSTACK_DEFAULT_ZONE_ID':
          return 'zone-1';
        case 'CLOUDSTACK_CUSTOM_COMPUTE_OFFER_NVME_ID':
          return 'custom-offer-nvme';
        case 'CLOUDSTACK_CUSTOM_COMPUTE_OFFER_HDD_ID':
          return 'custom-offer-hdd';
        default:
          return undefined;
      }
    }),
  };
  const networkRepository = {
    getNetwork: jest.fn(async () => ({ id: 'network-1' })),
  };
  const virtualMachineRepository = {
    createVirtualMachine: jest.fn(async () => ({ id: 'vm-cloudstack-id' })),
  };
  const instanceRepository = {
    getInstance: jest.fn(async () => ({
      id: 'instance-1',
      name: 'Offer',
      cpu: '2 vCPU',
      disk: '50',
      memory: '4096',
      cpuNumber: 2,
      cpuSpeedMhz: 2000,
      memoryInMb: 4096,
      rootDiskSizeInGb: 50,
      diskTier: 'NVMe',
    })),
  };
  const jobRepository = {
    createJob: jest.fn(),
  };
  const billingService = {
    registerUsage: jest.fn(async () => undefined),
  };
  const prisma = {
    templateOfferModel: {
      findUnique: jest.fn(async () => ({ id: 'template-1', name: 'Template' })),
    },
    domainModel: {
      findUnique: jest.fn(async () => ({
        id: 'domain-1',
        rootId: 'root-1',
        name: 'account-name',
        vpc: { id: 'vpc-1' },
      })),
    },
    virtualMachineModel: {
      findFirst: jest.fn(async () => null),
    },
  };

  return {
    projectRepository,
    cloudstackService,
    configService,
    networkRepository,
    virtualMachineRepository,
    instanceRepository,
    jobRepository,
    prisma,
    billingService,
  };
};

const makeSut = () => {
  const mocks = makeMocks();
  const useCase = new AddVirtualMachine(
    mocks.projectRepository as any,
    mocks.cloudstackService as any,
    mocks.configService as any,
    mocks.networkRepository as any,
    mocks.virtualMachineRepository as any,
    mocks.instanceRepository as any,
    mocks.jobRepository as any,
    mocks.prisma as any,
    mocks.billingService as any,
  );

  return { useCase, mocks };
};

const baseInput = {
  name: 'vm-test',
  offerId: 'instance-1',
  templateId: 'template-1',
  networkId: 'network-1',
  projectId: 'project-1',
};

describe('AddVirtualMachine use case', () => {
  it('should send custom specs to CloudStack and persist machine', async () => {
    const { useCase, mocks } = makeSut();

    const response = await useCase.execute(baseInput);

    expect(response).toEqual({ id: 'vm-cloudstack-id', jobId: 'job-1' });
    expect(mocks.cloudstackService.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        command: CloudstackCommands.VirtualMachine.DeployVirtualMachine,
        additionalParams: expect.objectContaining({
          serviceofferingid: 'custom-offer-nvme',
          'details[0].cpuNumber': '2',
          'details[0].cpuSpeed': '2000',
          'details[0].memory': '4096',
          rootdisksize: '50',
        }),
      }),
    );
    expect(mocks.virtualMachineRepository.createVirtualMachine).toHaveBeenCalledWith(
      expect.objectContaining({
        cpuNumber: 2,
        cpuSpeedMhz: 2000,
        memoryInMb: 4096,
        rootDiskSizeInGb: 50,
        name: baseInput.name,
      }),
    );
    expect(mocks.jobRepository.createJob).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'job-1',
        entityId: 'vm-cloudstack-id',
      }),
    );
    expect(mocks.billingService.registerUsage).toHaveBeenCalled();
  });

  it('should throw InvalidParamError when offer specs are invalid', async () => {
    const { useCase, mocks } = makeSut();
    mocks.instanceRepository.getInstance.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Offer',
      cpu: 'bad',
      disk: 'bad',
      memory: 'bad',
      cpuNumber: 0,
      cpuSpeedMhz: 2000,
      memoryInMb: 4096,
      rootDiskSizeInGb: 50,
      diskTier: 'HDD',
    });

    await expect(useCase.execute(baseInput)).rejects.toBeInstanceOf(
      InvalidParamError,
    );
  });
});
