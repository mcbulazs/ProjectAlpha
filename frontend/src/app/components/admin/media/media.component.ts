import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemTitle, MatListItemIcon, MatListItemLine, MatListItemMeta } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Channel } from '../../../interfaces/channel.interface';
import { CreateChannelDialogComponent } from './create-channel-dialog/create-channel-dialog.component';
import { DeleteModalComponent } from '../../delete-modal/delete-modal.component';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { EditChannelDialogComponent } from './edit-channel-dialog/edit-channel-dialog.component';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, MatButton, MatList, MatListItem, MatIcon, MatListItemTitle, MatListItemIcon, MatListItemLine, MatListItemMeta, MatIconButton, CdkDropList, CdkDrag],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService, private snackBar: MatSnackBar) { }

  data!: PageData;

  channels: Channel[] = [];
  changed: boolean = false;

  ngOnInit(): void {
    this.data = this.pds.data;
    for (const channel of this.data.channels) {
      this.channels.push({ ...channel });
    }
  }

  createChannel() {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(CreateChannelDialogComponent);
  }

  updateChannel(channel: Channel) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditChannelDialogComponent, {
      data: channel,
    });
  }

  deleteChannel(id: number) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(DeleteModalComponent, {
      width: '200px',
    }).afterClosed().subscribe(deleted => {
      if (deleted) {
        this.pds.deleteChannel(id).subscribe(success => {
          this.snackBar.open(`Channel ${success ? 'deleted' : 'deletion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
        })
      }
    });
  }

  drop(event: CdkDragDrop<Channel[]>) {
    moveItemInArray(this.data.channels, event.previousIndex, event.currentIndex);
    this.checkOrder();
  }

  //TODO: Implement this method
  checkOrder() {
    this.changed = false;
  }

  saveOrder() {
    this.pds.patchChannelOrder().subscribe(success => {
      this.snackBar.open(`Channels ${success ? 'reordered' : 'reorder failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    })
  }
}
