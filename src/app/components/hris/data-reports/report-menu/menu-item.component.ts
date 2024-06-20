import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import {Router} from '@angular/router';
import { NavItem } from 'src/app/models/hris/report-menu-item.interface';
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[] = [];
  @ViewChild('childMenu') public childMenu!: MatMenu;

  constructor(public router: Router) {
  }

  ngOnInit() {
  }
}