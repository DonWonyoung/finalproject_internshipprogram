<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm {
    public static function configure(Schema $schema): Schema {
        return $schema
        ->components([
            TextInput::make('name')->required(),
            TextInput::make('email')->email()->required(),
            Hidden::make('role')->default('admin')->dehydrated(true),
            TextInput::make('password')->password()->afterStateHydrated(function (TextInput $component, $state) {
                $component->state('');
            })->dehydrateStateUsing(fn ($state) => Hash::make($state))->dehydrated(fn ($state) => filled($state))->required(fn (string $context): bool => $context === 'create')
        ]);
    }
}