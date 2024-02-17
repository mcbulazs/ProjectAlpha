import { Component, OnInit } from '@angular/core';
import { ChannelType, PageDataService } from '../../../services/page.data.service';
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

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, MatButton, MatList, MatListItem, MatIcon, MatListItemTitle, MatListItemIcon, MatListItemLine, MatListItemMeta, MatIconButton],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss'
})
export class MediaComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService, private snackBar: MatSnackBar) { }

  data!: PageData;
  channelType = ChannelType;

  ngOnInit(): void {
    this.data = this.pds.data;
  }

  createChannel(type: ChannelType) {
    this.dialog.open(CreateChannelDialogComponent, {
      data: type,
    });
  }

  patchChannel(channel: Channel, type: ChannelType, editBtn: MatIconButton) {
    editBtn.disabled = true;
    const dialogRef = this.dialog.open(EditChannelDialogComponent, {
      data: {
        channel: channel,
        type: type,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      editBtn.disabled = false;
    });
  }

  deleteChannel(id: number, type: ChannelType, deleteBtn: MatIconButton) {
    deleteBtn.disabled = true;
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '200px',
    });
    dialogRef.afterClosed().subscribe(deleted => {
      deleteBtn.disabled = false;
      if (deleted) {
        this.pds.deleteChannel(id, type).subscribe(success => {
          this.snackBar.open(`Channel ${success ? 'deleted' : 'deletion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
        })
      }
    });
  }
}
