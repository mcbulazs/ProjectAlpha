import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_LINK_MAX_LENGTH, MAT_SNACKBAR_CONFIG, CHANNEL_TYPES } from '../../../../constants';
import { Channel } from '../../../../interfaces/channel.interface';
import { PageDataService } from '../../../../services/page.data.service';
import { MediaComponent } from '../media.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-channel-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatDialogTitle, MatDialogActions, MatDialogClose, MatSelectModule],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MediaComponent>, private pds: PageDataService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: Channel) { }

  channelNameMaxLength = CHANNEL_NAME_MAX_LENGTH;
  channelLinkMaxLength = CHANNEL_LINK_MAX_LENGTH;

  channel: Channel = {
    id: -1,
    link: '',
    name: '',
    site: ''
  }

  channelTypes = CHANNEL_TYPES;
  
  ngOnInit(): void {
    this.channel = { ...this.data };
  }

  update() {
    if (this.channel.name === this.data.name && this.channel.link === this.data.link && this.channel.site === this.data.site) {
      this.dialogRef.close();
      return;
    }
    this.pds.patchChannel(this.channel).subscribe(success => {
      this.snackBar.open(`Channel ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
