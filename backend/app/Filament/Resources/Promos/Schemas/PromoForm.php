<?php

namespace App\Filament\Resources\Promos\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PromoForm {
    public static function configure(Schema $schema): Schema {
        return $schema
        ->components([
            TextInput::make('name')->required(),
            FileUpload::make('image')->image()->disk('public')
            ->directory('promos')->visibility('public')
            ->imageEditor(false)->imagePreviewHeight('150')
            ->maxSize(2048)->required(),
            Textarea::make('description')->rows(3)->columnSpanFull(),
            TextInput::make('code')->required()->unique(ignoreRecord: true)->maxLength(20)
            ->live(onBlur: true)->afterStateUpdated(
                fn ($state, $set) => $set('code', strtoupper(trim($state)))
            ),
            Select::make('discount_type')->label('Discount type')->options([
                'percent' => 'Percent (%)',
                'fixed' => 'Fixed (Rp.)'
            ])->default('fixed')->required(),
            TextInput::make('discount_value')->label('Discount value')->numeric()->minValue(0)->required(),
            TextInput::make('min_purchase')->label('Minimum purchase')->numeric()->minValue(0)->required(),
            DateTimePicker::make('expires_at')->label('Expires at'),
            Select::make('is_active')->label('Is active')->options([
                1 => 'Yes',
                0 => 'No'
            ])->default(1)->required()
        ]);
    }
}