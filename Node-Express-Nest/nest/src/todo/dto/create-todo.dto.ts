import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    @MaxLength(32)
    title!: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}
