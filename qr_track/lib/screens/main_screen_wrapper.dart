import 'package:flutter/material.dart';
import 'package:qr_track/main.dart'; // We'll need to import MainScreen from main.dart

class MainScreenWrapper extends StatelessWidget {
  final String operatorId;
  final String operatorName;

  const MainScreenWrapper({
    super.key,
    required this.operatorId,
    required this.operatorName,
  });

  @override
  Widget build(BuildContext context) {
    // This widget simply displays your existing MainScreen.
    // In the future, you could use a Provider here to make the operatorId
    // available to all screens below it.
    return const MainScreen();
  }
}
