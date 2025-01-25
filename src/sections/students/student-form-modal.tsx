import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { StudentType, studentValidationSchema } from './schemas/validation';

const defaultValues = {
  name: '',
  class: '',
  section: '',
  rollNumber: '',
  avatarUrl: '',
  dateOfBirth: '',
  gender: '',
  guardianName: '',
  contactNumber: '',
  email: '',
  address: '',
  bloodGroup: '',
};

type StudentFormModalProps = {
  open: boolean;
  onClose: () => void;
  student?: StudentType;
  onSubmit: (data: StudentType) => void;
};

export function StudentFormModal({
  open,
  onClose,
  student,
  onSubmit,
  mode = 'edit',
}: StudentFormModalProps & { mode?: 'view' | 'edit' }) {
  // Class options
  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Check if the form is in view mode
  const isViewMode = mode === 'view';

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StudentType>({
    resolver: yupResolver(studentValidationSchema),
    defaultValues,
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      if (student) {
        reset({
          name: student.name || '',
          class: student.class || '',
          section: student.section || '',
          rollNumber: student.rollNumber || '',
          avatarUrl: student.avatarUrl || '',
          dateOfBirth: student.dateOfBirth || '',
          gender: student.gender || '',
          guardianName: student.guardianName || '',
          contactNumber: student.contactNumber || '',
          email: student.email || '',
          address: student.address || '',
          bloodGroup: student.bloodGroup || '',
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, student, reset]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmitHandler = (data: StudentType) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {isViewMode ? 'View Student' : student ? 'Edit Student' : 'Add New Student'}
        {isViewMode && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Iconify icon="eva:close-fill" width={25} />
          </IconButton>
        )}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent sx={{ paddingTop: 0 }}>
          <Grid container spacing={3}>
            {/* Avatar Upload */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <input
                id="avatar-input"
                accept="image/*"
                type="file"
                hidden
                onChange={handleImageChange}
                aria-label="Upload avatar"
                disabled={isViewMode}
              />
              <label htmlFor="avatar-input" aria-label="Upload avatar">
                <Box position="relative">
                  <IconButton component="span" disabled={isViewMode}>
                    <Controller
                      name="avatarUrl"
                      control={control}
                      render={({ field }) => (
                        <Avatar src={field.value} sx={{ width: 80, height: 80 }}>
                          {isViewMode ? field.value?.[0] : <Iconify icon="eva:camera-fill" />}
                        </Avatar>
                      )}
                    />
                  </IconButton>
                  {!isViewMode && (
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 3,
                        right: 10,
                        bgcolor: 'white',
                        boxShadow: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      component="span"
                    >
                      <Iconify icon="eva:edit-fill" width={14} />
                    </IconButton>
                  )}
                </Box>
              </label>
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    disabled={isViewMode}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Class */}
            <Grid item xs={6}>
              <Controller
                name="class"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.class}>
                    <InputLabel>Class</InputLabel>
                    <Select {...field} label="Class" disabled={isViewMode}>
                      {classes.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.class && (
                      <small style={{ color: 'red', marginLeft: '14px' }}>
                        {errors.class.message}
                      </small>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Section */}
            <Grid item xs={6}>
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.section}>
                    <InputLabel>Section</InputLabel>
                    <Select {...field} label="Section" disabled={isViewMode}>
                      {sections.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.section && (
                      <small style={{ color: 'red', marginLeft: '14px' }}>
                        {errors.section.message}
                      </small>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Roll Number */}
            <Grid item xs={12}>
              <Controller
                name="rollNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Roll Number"
                    disabled={isViewMode}
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber?.message}
                  />
                )}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    fullWidth
                    label="Date of Birth"
                    InputLabelProps={{ shrink: true }}
                    disabled={isViewMode}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender" disabled={isViewMode}>
                      {genderOptions.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.gender && (
                      <small style={{ color: 'red', marginLeft: '14px' }}>
                        {errors.gender.message}
                      </small>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Guardian Name */}
            <Grid item xs={12}>
              <Controller
                name="guardianName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Guardian Name"
                    disabled={isViewMode}
                    error={!!errors.guardianName}
                    helperText={errors.guardianName?.message}
                  />
                )}
              />
            </Grid>

            {/* Contact Number */}
            <Grid item xs={6}>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Number"
                    disabled={isViewMode}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber?.message}
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    disabled={isViewMode}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    multiline
                    rows={3}
                    disabled={isViewMode}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {/* Blood Group */}
            <Grid item xs={6}>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.bloodGroup}>
                    <InputLabel>Blood Group</InputLabel>
                    <Select {...field} label="Blood Group" disabled={isViewMode}>
                      {bloodGroups.map((bg) => (
                        <MenuItem key={bg} value={bg}>
                          {bg}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bloodGroup && (
                      <small style={{ color: 'red', marginLeft: '14px' }}>
                        {errors.bloodGroup.message}
                      </small>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {!isViewMode && (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {student ? 'Update' : 'Add'}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
