export class TodoDto {
    id!: number;
    title!: string;
    description?: string;
    completed!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}
