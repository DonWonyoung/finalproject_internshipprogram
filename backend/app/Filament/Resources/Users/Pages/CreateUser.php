<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord {
    protected static string $resource = UserResource::class;
    protected static ? string $title = 'Create Admin';

    public function getTitle(): string {
        return 'Create Admin';
    }

    public function getBreadcrumb(): string {
        return 'Create Admin';
    }

    public function getCreateFormActionLabel(): string {
        return 'Create Admin';
    }

    protected function mutateFormDataBeforeCreate(array $data): array {
        $data['role'] = 'admin';
        return $data;
    }
}