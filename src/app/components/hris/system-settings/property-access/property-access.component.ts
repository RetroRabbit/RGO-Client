import { Component, HostListener, ViewChild, EventEmitter, Output, TemplateRef, Input, NgZone } from '@angular/core';
import { SnackbarService } from 'src/app/services/shared-services/snackbar-service/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavService } from 'src/app/services/shared-services/nav-service/nav.service';
import { PropertyAccess } from 'src/app/models/hris/properties.interface';
import { AccessPropertiesService } from 'src/app/services/hris/access-properties.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { PropertyAccessLevel } from 'src/app/models/hris/constants/enums/property-access-levels.enum';
import { GenericDropDownObject } from 'src/app/models/hris/generic-drop-down-object.interface';

@Component({
    selector: 'app-property-access',
    templateUrl: './property-access.component.html',
    styleUrls: ['./property-access.component.css']
})

export class PropertyAccessComponent {
    searchTerm: string = '';
    dataSource: MatTableDataSource<PropertyAccess> = new MatTableDataSource();
    isLoading: boolean = true;
    permissions: Observable<GenericDropDownObject[]> = this.getEnumKeys(PropertyAccessLevel);
    displayedColumns: string[] = ['id', 'description', 'table', 'field', 'accessLevel'];
    pageSizes: number[] = [1, 5, 10, 25, 50, 100];

    screenWidth: number = 992;
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.screenWidth = window.innerWidth;
    }

    @Input()
    set searchQuery(text: string) {
        this.searchTerm = text;
        this.applySearchFilter();
    }
    get searchQuery(): string {
        return this.searchTerm;
    }
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private snackBarService: SnackbarService,
        private NavService: NavService,
        private ngZone: NgZone,
        private accessPropertiesService: AccessPropertiesService
    ) {
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.getAccessProperties();
        this.screenWidth = window.innerWidth;
    }

    ngAfterViewInit() {
        this.pageSize = 10;
        this.sort.sort({ id: 'id', start: 'asc', disableClear: false });
    }

    getEnumKeys(enumObject: any): Observable<GenericDropDownObject[]> {
        const keys = Object.keys(enumObject).filter(key => !isNaN(Number(enumObject[key])));
        const dropdownObjects: GenericDropDownObject[] = keys.map(key => ({ id: Number(enumObject[key]), name: this.splitAndCapitalizeCamelCase(key) }));
        return of(dropdownObjects);
    }

    getEnumKey(value: PropertyAccessLevel): string {
        const indexOfS = Object.values(PropertyAccessLevel).indexOf(value as unknown as PropertyAccessLevel);
        const key = Object.keys(PropertyAccessLevel)[indexOfS];
        return key;
    }

    applySearchFilter() {
        this.dataSource.filter = this.searchQuery.trim().toLowerCase();
        this.dataSource._updateChangeSubscription();
    }

    getAccessProperties(): void {
        this.isLoading = true;

        this.accessPropertiesService
            .GetAllAccessProperties().subscribe((data) => {
                this.setupDataSource(data);
                this.applySearchFilter();
            });
        this.isLoading = false;
    }

    private setupDataSource(data: any[]): void {
        this.dataSource = new MatTableDataSource(data);
        this.ngZone.run(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sortingDataAccessor = this.sortPropertyAccessData;
            this.dataSource.sort = this.sort;
        });
        this.dataSource._updateChangeSubscription();
    }

    sortPropertyAccessData(data: PropertyAccess, property: string): string | number { 
        switch (property) {  
            case 'description':
                return data.role.description;
            case 'table':
                return data.table;
            case 'field':
                return data.field;
            default:
                return ""; 
        } 
    } 

    changePermissions(ropertyId: number, permission: GenericDropDownObject): void {
        this.accessPropertiesService
            .UpdateProperties(ropertyId, permission.id || 0)
            .pipe(
                tap(() => {
                    this.snackBarService.showSnackbar("Updated", "snack-success");
                    this.getAccessProperties();
                }),
                catchError((er) => {
                    this.snackBarService.showError(er);
                    return of(null);
                })
            )
            .subscribe();
    }

    SeedCodes() {
        var test = this.accessPropertiesService.SeedProperties().subscribe({
            next: (data: any) => {
                this.getAccessProperties()
            },
            error: (er: any) => this.snackBarService.showError(er),
        });
    }

    get pageSize(): number {
        return this.paginator ? this.paginator.pageSize : 1;
    }

    set pageSize(size: number) {
        this.paginator.pageSize = size;
        this.dataSource._updateChangeSubscription();
    }

    get start(): number {
        return this.paginator
            ? this.paginator.pageIndex * this.paginator.pageSize + 1
            : 0;
    }

    get end(): number {
        return this.paginator
            ? (this.paginator.pageIndex + 1) * this.paginator.pageSize
            : 0;
    }

    goToPage(page: number): void {
        this.paginator.pageIndex = page - 1;
        this.dataSource._updateChangeSubscription();
    }

    get pageIndex(): number {
        return this.paginator?.pageIndex ?? 0;
    }

    get getNumberOfPages(): number {
        if (!this.paginator || this.paginator.pageSize === 0) return 0;
        return Math.ceil(this.paginator.length / this.paginator.pageSize);
    }

    get visiblePages(): number[] {
        const totalPages = this.getNumberOfPages;

        let maxVisiblePages = this.screenWidth <= 992 ? 2 : 4;

        let startPage = Math.max(
            this.paginator.pageIndex - Math.floor(maxVisiblePages / 2),
            0
        );
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
        startPage = Math.max(endPage - maxVisiblePages + 1, 0);

        const pages: number[] = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i + 1);
        }

        return pages;
    }

    splitAndCapitalizeCamelCase(input: string): string {
        const words = input.split(/(?=[A-Z])/);
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const result = capitalizedWords.join(' ');
        return result;
    }
}