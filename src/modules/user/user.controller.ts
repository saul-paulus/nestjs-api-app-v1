import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindAllUsersUseCase } from 'src/core/application/use-cases/user/find-all-users.usecase';
import { FindUserByIdUseCase } from 'src/core/application/use-cases/user/find-user-by-id.usecase';
import { CreateUserUseCase } from 'src/core/application/use-cases/user/create-user.usecase';
import { UpdateUserUseCase } from 'src/core/application/use-cases/user/update-user.usecase';
import { DeleteUserUseCase } from 'src/core/application/use-cases/user/delete-user.usecase';
import { UpdateUserDto } from 'src/core/application/dto/user/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserDataDto } from '../auth/dto/auth-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user (Admin)' })
  @ApiResponse({ status: 201, description: 'User created', type: UserDataDto })
  async create(@Body() registerDto: RegisterDto) {
    return this.createUserUseCase.execute(registerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiQuery({
    name: 'tenant_id',
    required: false,
    description: 'Filter by tenant ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved',
    type: [UserDataDto],
  })
  async findAll(
    @Query('tenant_id') tenantId?: string,
    @Req() req?: { tenantId?: string },
  ) {
    // If tenant_id isn't provided, could default to user's tenant if not superadmin
    const effectiveTenantId = tenantId || req?.tenantId;
    return this.findAllUsersUseCase.execute(effectiveTenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDataDto })
  async findById(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserDataDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
