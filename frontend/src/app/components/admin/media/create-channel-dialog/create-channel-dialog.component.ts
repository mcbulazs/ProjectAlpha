import { Component, Inject, OnInit } from '@angular/core';
import { MediaComponent } from '../media.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChannelType, PageDataService } from '../../../../services/page.data.service';
import { Channel } from '../../../../interfaces/channel.interface';
import { CHANNEL_LINK_MAX_LENGTH, CHANNEL_NAME_MAX_LENGTH, MAT_SNACKBAR_CONFIG } from '../../../../constants';

@Component({
  selector: 'app-create-channel-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './create-channel-dialog.component.html',
  styleUrl: './create-channel-dialog.component.scss'
})
export class CreateChannelDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MediaComponent>, private pds: PageDataService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: ChannelType) { }

  channelNameMaxLength = CHANNEL_NAME_MAX_LENGTH;
  channelLinkMaxLength = CHANNEL_LINK_MAX_LENGTH;

  channel: Channel = {
    id: -1,
    link: '',
    name: '',
  }

  channelType!: ChannelType;
  prettyType = '';
  
  ngOnInit(): void {
    this.channelType = this.data;
    const typeLowercase = ChannelType[this.channelType].toLowerCase();
    this.prettyType = `${typeLowercase.charAt(0).toUpperCase() + typeLowercase.slice(1)}`;
  }

  add() {
    if (this.channel.link === '' || this.channel.link === '') return;
    this.pds.postChannel(this.channel, this.channelType).subscribe(success => {
      this.snackBar.open(`${this.prettyType} channel ${success ? 'added' : 'creation failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    })
  }
}