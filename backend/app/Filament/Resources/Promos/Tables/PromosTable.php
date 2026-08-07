<?php

namespace App\Filament\Resources\Promos\Tables;

use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PromosTable {
    public static function configure(Table $table): Table {
        return $table
        ->columns([
            TextColumn::make('name'),
            ImageColumn::make('image')
        ])
        ->filters([
            //
        ])
        ->recordActions([
            ActionGroup::make([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make()
            ])
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                DeleteBulkAction::make()
            ])
        ]);
    }
}
