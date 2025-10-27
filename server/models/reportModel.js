// models/reportModel.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  issueType: { 
    type: String, 
    required: true,
    enum: ['wrong-info', 'fake-bus', 'poor-service', 'safety-concern', 'overcharging', 'route-deviation', 'other']
  },
  description: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);