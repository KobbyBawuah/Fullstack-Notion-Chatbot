"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorageIcon from "@mui/icons-material/Storage";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import UploadIcon from "@mui/icons-material/Upload";
import DialogTitle from "@mui/material/DialogTitle";

import IconButton from "@mui/material/IconButton";

async function deleteOpenAiKnowledgebase() {
  //pinecone deletion
  try {
    const result = await fetch("/api/dbdelete", {
      method: "POST",
    });
    const json = await result.json();
    console.log("result: ", json);
  } catch (err) {
    console.log("err:", err);
  }
}

async function deletelocalKnowledgebase() {
  //local DB deletion
  try {
    const result = await fetch("http://localhost:5000/delete-vectorstore", {
      method: "POST",
    });
    const json = await result.json();
    console.log("result from local: ", json);
  } catch (err) {
    console.log("err:", err);
  }
}

function SelectorPanel({
  label,
  onClick,
  exists,
  loading,
  onDelete,
  onUpload,
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      style={{
        height: "400px",
        width: "400px",
        background: "lightgray",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        cursor: "pointer",
      }}
      onClick={!loading && onClick}
    >
      {loading ? (
        <CircularProgress />
      ) : exists ? (
        <StorageIcon
          style={{ width: "100px", height: "100px", opacity: "0.6" }}
        />
      ) : (
        <AddCircleOutlineIcon
          style={{ width: "100px", height: "100px", opacity: "0.6" }}
        />
      )}
      {label}
      {exists && (
        <div
          style={{
            position: "relative",
            top: "80px",
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Tooltip title="Update Knowledge Base" placement="top">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onUpload();
              }}
            >
              <UploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Knowledge Base" placement="top">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Knowledge Base?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible. Are you sure you want to delete this?
            If you wish to use the knowledge base again you must re-create and
            upload the files.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              onDelete?.();
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function ChatSelector({
  onSelect,
  localExists,
  remoteExists,
  loading,
  onDelete,
  onUpload,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SelectorPanel
        label="remote"
        onClick={() => onSelect(false, remoteExists)}
        exists={remoteExists}
        loading={loading}
        onDelete={() => {
          deleteOpenAiKnowledgebase();
          onDelete("remote");
        }}
        onUpload={() => {
          onUpload(false);
        }}
      />
      <SelectorPanel
        label="local"
        onClick={() => onSelect(true, localExists)}
        exists={localExists}
        loading={loading}
        onDelete={() => {
          deletelocalKnowledgebase();
          onDelete("local");
        }}
        onUpload={() => {
          onUpload(true);
        }}
      />
    </div>
  );
}
